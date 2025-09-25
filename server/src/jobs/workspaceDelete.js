import cron from 'node-cron';
import Workspace from '../models/Workspace.js';
import { permanentlyDeleteWorkspace } from '../controllers/workspaceController.js';

cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running Workspace cleanup job...');

        const WorkspacesToDelete = await Workspace.find({
            isDeleted: true,
            scheduledDeletionAt: { $lte: new Date() }
        });

        console.log(`Found ${WorkspacesToDelete.length} Workspaces to permanently delete`);

        for (const workspace of WorkspacesToDelete) {
            try {
                const result = await permanentlyDeleteWorkspace(workspace._id);
                if (result.success) {
                    console.log(`Successfully deleted Workspace: ${workspace.name}`);
                } else {
                    console.log(`Failed to delete Workspace ${workspace.name}: ${result.message}`);
                }
            } catch (error) {
                console.error(`Error deleting Workspace ${workspace.name}:`, error);
            }
        }

        console.log('Workspace cleanup job completed');
    } catch (error) {
        console.error('Error in Workspace cleanup job:', error);
    }
});

export default cron;