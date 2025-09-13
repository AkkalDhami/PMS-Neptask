import Organization from "../models/Organization.js";
import Project from "../models/Project.js";


export const authorizeOrg = (roles = []) => async (req, res, next) => {
    const orgId = req.params.orgId;
    const userId = req.user._id;

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({
        success: false,
        message: "Organization not found"
    });

    const member = org.members.find(m => m.user.toString() === userId.toString());
    if (!member || !roles.includes(member.role)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: insufficient role"
        });
    }

    req.organization = org;
    req.orgRole = member.role;
    next();
};

export const authorizeProject = (roles = []) => async (req, res, next) => {
    const projectId = req.params.projectId;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({
        success: false,
        message: "Project not found"
    });

    const member = project.members.find(m => m.user.toString() === userId.toString());
    if (!member || !roles.includes(member.role)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: insufficient role"
        });
    }

    req.project = project;
    req.projectRole = member.role;
    next();
};