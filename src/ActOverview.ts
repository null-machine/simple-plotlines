import {
	WorkspaceLeaf
} from 'obsidian';

import {
	Scene,
	SceneScanner
} from './SceneScanner';

export const VIEW_TYPE_ACT_OVERVIEW = 'simple-plotlines-act-overview';

export class ActOverview extends SceneScanner {
	
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_ACT_OVERVIEW;
	}

	getDisplayText() {
		return 'ACT OVERVIEW';
	}
	
	protected render(container: HTMLElement) {
		
		container.empty();
		if (this.scenes.length == 0) {
			return;
		}

		container.addClass('simple-plotlines-act-overview');
		
		const actGroups = new Map<number, Scene[]>();
		for (const scene of this.scenes) {
			const actIndex = Number(scene.act);
			if (!actGroups.has(actIndex)) {
				actGroups.set(actIndex, []);
			}
			actGroups.get(actIndex)!.push(scene);
		}
		const sortedActs = Array.from(actGroups.keys()).sort((a, b) => a - b);
		
		for (const actIndex of sortedActs) {
			const scenes = actGroups.get(actIndex)!;
			scenes.sort((a, b) => {
				const sceneA = Number(a.scene);
				const sceneB = Number(b.scene);
				if (sceneA !== sceneB) {
					return sceneA - sceneB;
				}
				return a.file.basename.localeCompare(b.file.basename);
			});
		}
		
		for (const actIndex of sortedActs) {
			const actScenes = actGroups.get(actIndex)!;
			const actColumn = container.createDiv({ cls: 'simple-plotlines-overview-column' });
			const actHeader = actColumn.createDiv({ cls: 'simple-plotlines-overview-column-header' });
			actHeader.setText(`ACT ${actIndex}`);
			
			const actContent = actColumn.createDiv({ cls: 'simple-plotlines-overview-column-content' });
			
			for (const scene of actScenes) {
				const sceneCard = actContent.createDiv({ cls: 'simple-plotlines-overview-card' });
				
				
				const sceneTitle = sceneCard.createDiv({ cls: 'simple-plotlines-overview-card-title' });
				sceneTitle.setText(scene.file.basename);
				
				if (scene.tags && scene.tags.length > 0) {
					const tagsContainer = sceneCard.createDiv({ cls: 'simple-plotlines-overview-card-tags' });
					for (const tag of scene.tags) {
						const cardTag = tagsContainer.createSpan({ cls: 'simple-plotlines-overview-card-tag' });
						cardTag.setText(tag);
						const tagIndex = this.lines.indexOf(tag);
						if (tagIndex !== -1) {
							cardTag.addClass(`simple-plotlines-color-${tagIndex % this.colorCount}`);
						}
					}
				}
				sceneCard.draggable = true;
				
				sceneCard.ondragstart = (e: DragEvent) => {
					e.dataTransfer!.effectAllowed = 'move';
					e.dataTransfer!.setData('text/plain', scene.file.path);
					sceneCard.addClass('dragging');
				};
				
				sceneCard.ondragend = () => {
					sceneCard.removeClass('dragging');
					container.querySelectorAll('.drag-over').forEach(el => {
						el.removeClass('drag-over');
					});
				};
				
				sceneCard.ondragover = (e: DragEvent) => {
					e.preventDefault();
					e.dataTransfer!.dropEffect = 'move';
					sceneCard.addClass('drag-over');
				};
				
				sceneCard.ondragleave = () => {
					sceneCard.removeClass('drag-over');
				};
				
				sceneCard.ondrop = async(e: DragEvent) => {
					e.preventDefault();
					sceneCard.removeClass('drag-over');
					
					const draggedPath = e.dataTransfer!.getData('text/plain');
					if (draggedPath === scene.file.path) {
						return;
					}
					
					await this.moveScene(draggedPath, scene);
				};
				
				sceneCard.onclick = async(e: MouseEvent) => {
					if (sceneCard.hasClass('dragging')) {
						return;
					}
					const leaves = this.app.workspace.getLeavesOfType('markdown');
					for (const leaf of leaves) {
						if (leaf.view && 'file' in leaf.view && (leaf.view as any).file?.path === scene.file.path) {
							this.app.workspace.setActiveLeaf(leaf, { focus: true });
							return;
						}
					}
					await this.app.workspace.getLeaf(true).openFile(scene.file);
				};
			}
		}
	}
	
	private async moveScene(draggedPath: string, targetScene: Scene) {
		
		const draggedScene = this.scenes.find(s => s.file.path === draggedPath);
		if (!draggedScene) {
			return;
		}
		
		// when in webdev do as the webdevs do
		if (Number(targetScene.act) === Number(draggedScene.act) && Number(targetScene.scene) - Number(draggedScene.scene) === 1) {
			draggedScene.scene = Number(targetScene.scene) + 0.5;
		} else {
			draggedScene.scene = Number(targetScene.scene) - 0.5;
		}
		
		if (targetScene.act === draggedScene.act) {
			await this.stackAct(targetScene.act);
		} else {
			const oldAct = draggedScene.act;
			draggedScene.act = targetScene.act;
			await this.stackAct(targetScene.act);
			await this.stackAct(oldAct);
		}
		this.refresh();
	}
	
	private async stackAct(act: number) {
		const sortedScenes = this.scenes.filter(i => i.act === act);
		sortedScenes.sort((a, b) => Number(a.scene) - Number(b.scene));
		for (let i = sortedScenes.length; i > 0; --i) {
			const scene = sortedScenes[i - 1];
			if (!scene) {
				continue;
			}
			const newName = `${String(scene.act).padStart(2, '0')}-${String(i).padStart(2, '0')} ${scene.name}`;
			if (scene.file.basename === newName) {
				continue;
			}
			const newPath = scene.file.path.replace(scene.file.basename, newName);
			try {
				await this.app.vault.rename(scene.file, newPath);
			} catch(error) {
				console.error(error);
			}
		}
	}
}
