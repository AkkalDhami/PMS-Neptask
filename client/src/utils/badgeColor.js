
export const getRoleBadgeColor = (role) => {
    switch (role) {
        case "owner":
            return "bg-orange-500 text-white";
        case "admin":
            return "bg-purple-500 text-white";
        case "manager":
            return "bg-blue-500 text-white";
        case "member":
            return "bg-green-500 text-white";
        case "viewer":
            return "bg-primary";
        case "guest":
            return "bg-indigo-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

export const getPriorityColor = (priority) => {
    const colors = {
        high: "bg-orange-500/10 border-orange-300 dark:border-orange-800 text-orange-600",
        medium: "bg-green-500/10 border-green-300 dark:border-green-800 text-green-500",
        low: "bg-yellow-500/10 border-yellow-300 dark:border-yellow-800 text-yellow-600",
        urgent: "bg-red-500/10 border-red-300 dark:border-red-800 text-red-600",
    }
    return colors[priority] || "bg-slate-500/10 border-slate-300 dark:border-slate-800 text-primary";
};


export const getProjectStatusBadge = (status) => {
    const colors = {
        planning: "bg-blue-500/10 border-blue-400 dark:border-blue-700 text-blue-600",
        pending: "bg-amber-500/10 border-amber-400 dark:border-amber-700 text-amber-600",
        "in-progress": "bg-indigo-500/10 border-indigo-400 dark:border-indigo-700 text-indigo-600",
        review: "bg-purple-500/10 border-purple-400 dark:border-purple-700 text-purple-600",
        completed: "bg-green-500/10 border-green-400 dark:border-green-700 text-green-600",
        "on-hold": "bg-orange-500/10 border-orange-400 dark:border-orange-700 border-orange-400 dark:border-orange-700 text-orange-600",
        cancelled: "bg-red-500/10 border-red-400 dark:border-red-700 text-red-600",
    };

    return colors[status] || "bg-gray-500 text-white";

};


export const getProjectStatusClassName = (status) => {
    const classname = {
        planning: "dark:bg-slate-800 dark:text-gray-100 bg-gray-100 text-gray-700",
        pending: "bg-yellow-500/10 text-yellow-800",
        "in-progress": "bg-blue-500/10 text-blue-600",
        review: "bg-purple-500/10 text-purple-800",
        completed: "bg-green-500/10 text-green-600 border border-green-500/30 hover:border-green-500",
        "on-hold": "bg-orange-500/10 text-orang6-800",
        cancelled: "bg-red-500/10 text-red-860",
    }
    return classname[status]
}

export const getBoderClassName = (status) => {
    const classname = {
        pending: "border-amber-500",
        "in-progress": "border-blue-500",
        completed: " border-green-500",
    }
    return classname[status];
}