import {  configure } from 'browserfs'

export async function configureFS() {
    return new Promise((resolve, reject) => {
        configure({ fs: "LocalStorage", options: null }, (error) => {
            if (error)
                reject(error)
            else
                resolve(void 0);
        })        
    })
}