const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  findAll: () => ipcRenderer.invoke('findAll'),
  findByPriority: (priority) => ipcRenderer.invoke('findByPriority',priority),
  findPriority: () => ipcRenderer.invoke('findPriority'),
  updateAll: (list) => ipcRenderer.invoke('updateAll',list),
  save: (item) => ipcRenderer.invoke('save',item),
  delete: (id) => ipcRenderer.invoke('delete',id),
  update: (item) => ipcRenderer.invoke('update',item),
  win2show:() => ipcRenderer.invoke('win2show')
})