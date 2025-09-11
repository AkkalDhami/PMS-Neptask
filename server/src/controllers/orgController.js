import { TryCatch } from "../middlewares/tryCatch.js";
import Organization from "../models/Organization.js";

//? CREATE ORGANIZATION
export const createOrg = TryCatch(async (req, res) => {
    const { name, owner = req?.user?._id, orgEmail } = req.body;
    console.log(req.user);
    if (!owner) return res.status(401).json({
        success: false,
        message: "Owner is required!",
    })
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) return res.status(401).json({
        success: false,
        message: "Organization already registered!",
    })

    const existingOrgEmail = await Organization.findOne({ orgEmail });
    if (existingOrgEmail) return res.status(401).json({
        success: false,
        message: "Organization email is already registered!",
    })
    console.log(req.file);
    let logo = {};
    if (req.file) {
        logo = {
            public_id: req.file.filename,
            url: req.file.path
        }
    }
    const org = new Organization({
        name,
        logo,
        owner,
        orgEmail,
        members: [
            {
                user: owner,
                role: "owner",
                joinedAt: new Date(),
            },
        ],
    });

    await org.save();
    res.status(201).json({
        success: true,
        message: "Organization created successfully!",
    })
})

//? GET ORGANIZATIONS
export const getOrgs = TryCatch(async (req, res) => {
    const orgs = await Organization.find().populate("owner")
    res.status(201).json({
        success: true,
        message: "Get Organizations",
        orgs
    })
})

//? GET A ORGANIZATION
export const getOrg = TryCatch(async (req, res) => {
    const org = await Organization.findById(req.params.id).populate("owner").populate("members.user")
    res.status(201).json({
        success: true,
        message: "Get Organization",
        org
    })
})

//? DELETE ORGANIZATION
export const deleteOrg = TryCatch(async (req, res) => {
    const { id } = req.params;
    const deletedOrg = await Organization.findByIdAndDelete(id);
    if (!deletedOrg) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });

    res.status(200).json({
        success: true,
        message: "Organization deleted successfully!",
    })
})

//? ADD MEMBER
export const addMember = TryCatch(async (req, res) => {
    const { orgId: id } = req.params;
    const { user, role } = req.body;
    const org = await Organization.findById(id);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    org.members.push({ user, role });
    await org.save();
    res.status(200).json({
        success: true,
        message: "Member added successfully!",
    })
})

//? REMOVE MEMBER
export const removeMember = TryCatch(async (req, res) => {
    const { orgId: id } = req.params;
    const { user } = req.body;
    const org = await Organization.findById(id);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    org.members = org.members.filter(member => member.user.toString() !== user);
    await org.save();
    res.status(200).json({
        success: true,
        message: "Member removed successfully!",
    })
})

//? UPDATE MEMBER ROLE
export const updateMemberRole = TryCatch(async (req, res) => {
    const { orgId: id } = req.params;
    const { user, role } = req.body;
    const org = await Organization.findById(id).populate("members.user");
    const existingMember = org.members.find(member => member.user.toString() === user);
    if (!existingMember) return res.status(401).json({
        success: false,
        message: "Member not found!",
    });
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    org.members = org.members.map(member => member.user.toString() === user ? { ...member, role } : member);
    org.members.user = org.members.user.map(member => member._id.toString() === user ? { ...member, role } : member);
    await org.save();
    res.status(200).json({
        success: true,
        message: "Member role updated successfully!",
    })
})