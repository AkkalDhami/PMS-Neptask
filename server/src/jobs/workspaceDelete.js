import cron from 'node-cron';
import Workspace from '../models/Workspace.js';
import { permanentlyDeleteWorkspace } from '../controllers/orgController.js';
// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
    try {
        console.log('Running Workspace cleanup job...');

        const WorkspacesToDelete = await Workspace.find({
            isDeleted: true,
            scheduledDeletionAt: { $lte: new Date() }
        });

        console.log(`Found ${WorkspacesToDelete.length} Workspaces to permanently delete`);

        for (const org of WorkspacesToDelete) {
            try {
                const result = await permanentlyDeleteWorkspace(org._id);
                if (result.success) {
                    console.log(`Successfully deleted Workspace: ${org.name}`);
                } else {
                    console.log(`Failed to delete Workspace ${org.name}: ${result.message}`);
                }
            } catch (error) {
                console.error(`Error deleting Workspace ${org.name}:`, error);
            }
        }

        console.log('Workspace cleanup job completed');
    } catch (error) {
        console.error('Error in Workspace cleanup job:', error);
    }
});

export default cron;