import { createClient } from "@supabase/supabase-js"

const url = "https://httdojowfqvljyeysmgo.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dGRvam93ZnF2bGp5ZXlzbWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjc3ODAsImV4cCI6MjA2NzcwMzc4MH0.U5gyD2oKT_RUpeZnfMnw-Bm7mA0acIAH6aJ_ZD2CyQg"

const supabase = createClient(url,key)

export default function mediaUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{

            if(file == null){
                reject("No file selected")
                return
            }

            const timestamp = new Date().getTime()
            const newName = timestamp+file.name

            supabase.storage.from("products").upload(newName, file, {
                upsert:false,
                cacheControl:"3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("products").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl)
            }).catch(
                ()=>{
                    reject("Error occured in supabase connection")
                }
            )
        }
    )

    return mediaUploadPromise

}


