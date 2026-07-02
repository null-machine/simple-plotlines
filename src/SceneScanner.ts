import {
	App,
	ItemView,
	getAllTags,
	TFile,
	WorkspaceLeaf
} from 'obsidian';


export interface Scene {
	file: TFile;
	name: string;
	act: Number;
	scene: Number;
	tags: string[];
}

export abstract class SceneScanner extends ItemView {
	
	scenes: Scene[] = [];
	lines: string[] = [];
	colorCount = 9;
	
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}
	
	getIcon(): string {
		return 'none';
	}
	
	async onOpen() {
		this.refresh();
	}
	
	async onClose() {
	}
	
	protected abstract render(container: HTMLElement): void;
	
	refresh() {
		this.updateData();
		this.render(this.contentEl);
	}
	
	protected updateData() {
		const files = this.app.vault.getMarkdownFiles();
		let manualTagOrder: boolean = false;
		this.scenes = [];
		for (const file of files) {
			let scene = this.getScene(file);
			if (!scene) {
				continue;
			}
			if (scene.act == 0 && scene.scene == 0 && scene.name === 'TAG ORDER') {
				manualTagOrder = true;
				this.lines = scene.tags;
				for (let j = 0; j < this.scenes.length; ++j) {
					this.scenes[j]?.tags.sort((a: string, b: string) => this.lines.indexOf(a) - this.lines.indexOf(b));
				}
			} else {
				this.scenes.push(scene);
			}
		}
		if (this.scenes.length == 0) {
			return;
		}
		this.scenes.sort((a, b) => {
			if (Number(a.act)!== Number(b.act)) {
				return Number(a.act)- Number(b.act);
			} else if (Number(a.scene)!== Number(b.scene)) {
				return Number(a.scene)- Number(b.scene);
			} else if (a.file.basename < b.file.basename) {
				return -1;
			} else {
				return 0;
			}
		});
		if (!manualTagOrder) {
			this.lines = [];
			for (const scene of this.scenes) {
				for (const tag of scene.tags) {
					if (this.lines.indexOf(tag) === -1) {
						this.lines.push(tag);
					}
				}
			}
			this.lines.sort();
		}
	}
	
	protected getScene(file: TFile) {
		let basename: string = file.basename;
		let dashIndex = basename.indexOf('-');
		let spaceIndex = basename.indexOf(' ');
		if (dashIndex === -1 || spaceIndex < dashIndex) {
			return null;
		}
		let act: Number = Number(basename.substring(0, dashIndex));
		let scene: Number = Number(basename.substring(dashIndex + 1, spaceIndex));
		if (act == null && scene == null) {
			return null;
		}
		let name = basename.substring(spaceIndex + 1);
		
		const fileCache = this.app.metadataCache.getFileCache(file);
		if (fileCache == null) {
			return null;
		}
		let tags = getAllTags(fileCache);
		if (tags == null || tags.length === 0) {
			return null;
		}
		for (let i = 0; i < tags.length; ++i) {
			if (tags[i]) {
				tags[i] = (tags[i] as String).substring(1);
			}
		}
		
		const result: Scene = {
			file: file,
			name: name,
			act: act,
			scene: scene,
			tags: tags,
		}
		
		return result;
	}
}
