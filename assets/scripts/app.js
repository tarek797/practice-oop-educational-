class Tooltip { }

class ProjectItem {
    constructor(id, updateProjectListsFunction) {
        this.id = id
        this.updateProjectListsHandler = updateProjectListsFunction
        this.connectMoreInfoButton()
        this.connectSwitchButton()
    }
    connectMoreInfoButton() {

    }
    connectSwitchButton() {
        const projectItemElement = document.getElementById(this.id)
        const switchBtn = projectItemElement.querySelector('button:last-of-type')
        switchBtn.addEventListener('click', this.updateProjectListsHandler)
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        const prjItems = document.querySelectorAll(`#${type}-projects li`)
        console.log(prjItems)
        for (const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this)));
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction
    }
    addProject() {
        console.log("finished")
    }
    switchProject(projectId) {
        //this.addProject(); it's not logically correct. we should add the project to other instance.

        this.switchHandler(this.projects.find(p => p.id === projectId))
        this.projects = this.projects.filter(p => p.id !== projectId)
    }
}

class App {
    static init() {
        const activeProjectList = new ProjectList("active")
        const finishedProjectList = new ProjectList("finished")
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList))
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList))

    }
}

App.init();