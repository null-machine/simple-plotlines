import {
	WorkspaceLeaf
} from 'obsidian';

import {
	SceneScanner
} from './SceneScanner';

export const VIEW_TYPE_PLOTLINES = 'simple-plotlines-plotlines';


export class Plotlines extends SceneScanner {

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_PLOTLINES;
	}

	getDisplayText() {
		return 'PLOTLINES';
	}
	
	protected render(container: HTMLElement) {
		
		if (this.scenes.length == 0) {
			return;
		}
		
		container.empty();
		let dividerIndexes = [];
		let blankSalt = 0;
		
		// act header
		let gridTemplateAreas: string = '"B' + blankSalt;
		let blank = container.createDiv();
		blank.setCssStyles({
			gridArea: 'B' + blankSalt
		});
		++blankSalt;
		let prevAct: Number = Number.NaN;
		for (let i = 0; i < this.scenes.length; ++i) {
			const scene = this.scenes[i];
			if (!scene) {
				continue;
			}
			gridTemplateAreas += ' A' + scene.act;
			if (prevAct !== scene.act) {
				dividerIndexes.push(i);
				let actHeader = container.createDiv({cls: 'simple-plotlines-header-cell simple-plotlines-divider-column'});
				actHeader.setCssStyles({
					gridArea: 'A' + scene.act
				});
				actHeader.setText('ACT ' + scene.act);
				prevAct = scene.act;
			}
		}
		gridTemplateAreas += '"\n';
		
		const gridBody: string[] = new Array(this.lines.length).fill('');
		
		let salt: Number = 0;
		
		for (let i = 0; i < this.scenes.length; ++i) {
			let scene = this.scenes[i];
			if (!scene) {
				continue;
			}
			for (let j = 0; j < this.lines.length; ++j) {
				let sceneAffectsTag: boolean = false;
				for (let k = 0; k < scene.tags.length && !sceneAffectsTag; ++k) {
					if (this.lines.indexOf(scene.tags[k] as string) === j) {
						sceneAffectsTag = true;
					}
				}
				if (sceneAffectsTag) {
					let area: string = 'A' + scene.act + 'S' + scene.scene + 'I' + salt;
					gridBody[j] += ' ' + area;
					let sceneArea = container.createDiv({ cls: 'simple-plotlines-cell' });
					sceneArea.setCssStyles({
						padding: '1em',
						gridArea: area,
						cursor: 'pointer'
					});
					sceneArea.setText(scene.file.basename);
					sceneArea.addClass('simple-plotlines-color-' + j % this.colorCount);
					if (dividerIndexes.contains(i)) {
						sceneArea.addClass('simple-plotlines-divider-column');
					}
					sceneArea.onclick = async() => {
						const leaves = this.app.workspace.getLeavesOfType('markdown');
						for (const leaf of leaves) {
							if (leaf.view && 'file' in leaf.view && (leaf.view as any).file?.path === scene.file.path) {
								this.app.workspace.setActiveLeaf(leaf, { focus: true });
								return;
							}
						}
						await this.app.workspace.getLeaf(true).openFile(scene.file);
					};
					salt = Number(salt) + 1;
				} else {
					gridBody[j] += ' B' + blankSalt;
					blank = container.createDiv({ cls: 'simple-plotlines-cell' });
					const inner = blank.createDiv({ cls: 'simple-plotlines-buffer-cell'});
					inner.addClass('simple-plotlines-border-color-' + j % this.colorCount);
					blank.setCssStyles({
						gridArea: 'B' + blankSalt
					});
					if (dividerIndexes.contains(i)) {
						blank.addClass('simple-plotlines-divider-column');
					}
					++blankSalt;
				}
			}
		}
		
		for (let i = 0; i < gridBody.length; ++i) {
			gridTemplateAreas += '"L' + i + ' ' + gridBody[i] + '"\n';
			let lineHeader = container.createDiv();
			lineHeader.setCssStyles({
				gridArea: 'L' + i
			});
			lineHeader.setText(this.lines[i] as string);
			lineHeader.addClass('simple-plotlines-color-' + i % this.colorCount);
		}
		
		container.addClass('simple-plotlines-plotlines');
		container.setCssStyles({
			gridTemplateAreas: gridTemplateAreas
		});
		container.addEventListener('wheel', (e: WheelEvent) => {
			(e.currentTarget as HTMLDivElement).scrollLeft += e.deltaY / 2;
			(e.currentTarget as HTMLDivElement).scrollTop += e.deltaX;
			e.preventDefault();
		});
	}
}
