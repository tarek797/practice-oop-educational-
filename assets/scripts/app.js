class DOMHelper {
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true)
        element.replaceWith(clonedElement)
        return clonedElement
    }

    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId)
        const destinationElement = document.querySelector(newDestinationSelector)
        destinationElement.append(element)
    }

}

class Tooltip { 

    constructor(closeNotifierFunction, text) {
        this.closeNotifier = closeNotifierFunction
        this.text = text
    }
    closeTooltip = () => { 
        this.detach()
        this.closeNotifier()
    }

    detach () {
        this.element.remove()
    }
    attach() {
        const tooltipElement = document.createElement('div')
        tooltipElement.className = 'card'
        tooltipElement.textContent = this.text
        tooltipElement.addEventListener('click', this.closeTooltip)
        this.element = tooltipElement
        document.body.append(tooltipElement)
    }
}

class ProjectItem {
    hasActiveTooltip = false
    constructor(id, updateProjectListsFunction, type) {
        this.id = id
        this.updateProjectListsHandler = updateProjectListsFunction
        this.connectMoreInfoButton()
        this.connectSwitchButton(type)
    }

    showMoreInfoHandler() {
        if(this.hasActiveTooltip){
            return
        }
        const projectElement = document.getElementById(this.id)
        const tooltipText = projectElement.dataset.extraInfo
        const tooltip = new Tooltip(() => {
            this.hasActiveTooltip = false
        }, tooltipText)
        tooltip.attach()
        this.hasActiveTooltip = true
    }
    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id)
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type')
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this))
    }
    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id)
        let switchBtn = projectItemElement.querySelector('button:last-of-type')
        switchBtn = DOMHelper.clearEventListeners(switchBtn)
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id))

    }

    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn
        this.connectSwitchButton(type)
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type
        const prjItems = document.querySelectorAll(`#${type}-projects li`)
        for (const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type));
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction
    }
    addProject(project) {
        this.projects.push(project)
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`)
        project.update(this.switchProject.bind(this), this.type)
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