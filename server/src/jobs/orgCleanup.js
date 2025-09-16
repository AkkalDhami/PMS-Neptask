import cron from 'node-cron';
import Organization from '../models/Organization.js';
import { permanentlyDeleteOrganization } from '../controllers/orgController.js';


cron.schedule('0 2 * * *', async () => {
    try {
        console.log('Running organization cleanup job...');

        const organizationsToDelete = await Organization.find({
            isDeleted: true,
            scheduledDeletionAt: { $lte: new Date() }
        });

        console.log(`Found ${organizationsToDelete.length} organizations to permanently delete`);

        for (const org of organizationsToDelete) {
            try {
                const result = await permanentlyDeleteOrganization(org._id);
                if (result.success) {
                    console.log(`Successfully deleted organization: ${org.name}`);
                } else {
                    console.log(`Failed to delete organization ${org.name}: ${result.message}`);
                }
            } catch (error) {
                console.error(`Error deleting organization ${org.name}:`, error);
            }
        }

        console.log('Organization cleanup job completed');
    } catch (error) {
        console.error('Error in organization cleanup job:', error);
    }
});

export default cron;