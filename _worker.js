export  default{
    async fetch(request,env){
        const{default: worker}= await import('./.next/server/app/play/characters/page.js')
        return worker.fetch(request,env)
    }
}