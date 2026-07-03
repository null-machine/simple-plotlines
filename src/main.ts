import {
	Plugin,
	WorkspaceLeaf
} from 'obsidian';

import {
	Plotlines,
	VIEW_TYPE_PLOTLINES
} from './Plotlines';

import {
	ActOverview,
	VIEW_TYPE_ACT_OVERVIEW
} from './ActOverview';

export default class SimplePlotlines extends Plugin {

	async onload() {

		this.registerView(
			VIEW_TYPE_PLOTLINES,
			(leaf) => new Plotlines(leaf)
		);

		this.registerView(
			VIEW_TYPE_ACT_OVERVIEW,
			(leaf) => new ActOverview(leaf)
		);

		// this.addRibbonIcon('book-open', 'View plot lines', (_evt: MouseEvent) => {
		// 	this.activateView(VIEW_TYPE_ACT_OVERVIEW);
		// });
		
		this.registerEvent(this.app.workspace.on('active-leaf-change', async (leaf: WorkspaceLeaf | null) => {
			await this.refreshViews();
		}));
		
		this.registerEvent(this.app.vault.on('rename', async () => {
			await this.refreshViews();
		}));
		
		this.registerEvent(this.app.metadataCache.on('changed', async () => {
			await this.refreshViews();
		}));
		
		await this.activateView(VIEW_TYPE_PLOTLINES);
		await this.activateView(VIEW_TYPE_ACT_OVERVIEW);
	}
	
	async refreshViews() {
		
		let leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PLOTLINES);
		
		if (leaves.length < 1) {
			await this.activateView(VIEW_TYPE_PLOTLINES);
		}
		
		for (const leaf of leaves) {
			(leaf.view as Plotlines).refresh();
		}
		
		leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_ACT_OVERVIEW);
		
		if (leaves.length < 1) {
			await this.activateView(VIEW_TYPE_ACT_OVERVIEW);
		}
		
		for (const leaf of leaves) {
			(leaf.view as ActOverview).refresh();
		}
	}
	
	async activateView(viewType: string): Promise<void> {
		const { workspace } = this.app;
		
		let leaf: WorkspaceLeaf | undefined = undefined;
		const leaves = workspace.getLeavesOfType(viewType);
		
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getLeaf(true);
			if (leaf) {
				await leaf.setViewState({ type: viewType, active: true });
			}
		}
		
		if (leaf) {
			await workspace.revealLeaf(leaf);
		}
	}
	
	onunload() {}
}
