import {useSQLiteContext} from  "expo-sqlite"
export type UserDatabase = {
    tokey:string
    use: number
    name:string
    vendedor:number
}
export function useUserDatabase(){
    const database = useSQLiteContext()

    async function speaker() {
        const stateamentu = await database.prepareAsync(
            "UPDATE user SET use =$use"
        )
        try{
            await stateamentu.executeAsync({
                $use: 0
            })
        }catch(error){
        throw error
        }finally{
            await stateamentu.finalizeAsync()
        }}

    async function create(data: UserDatabase) {
        const response = await serchByTokey(data.tokey)
        if(response[0]){
            update(data.tokey)
            return
        }
        speaker()
        const stateament = await database.prepareAsync(
            "INSERT INTO user (tokey,use,name,vendedor) VALUES ($tokey,$use,$name,$vendedor)"
        )
        try{
            const result = await stateament.executeAsync({   
                $tokey: data.tokey,  
                $use: data.use,
                $name: data.name,
                $vendedor: data.vendedor,
            })
            const insertedRowId = result.lastInsertRowId.toLocaleString()
            return {insertedRowId}
        }catch(error){
            throw error
        }finally{
            await stateament.finalizeAsync()
        }
    }
    async function serchByTokey(tokey: string) {
        try {
            const query = "SELECT * FROM user WHERE tokey = ?";
            const response = await database.getAllAsync<UserDatabase>(query, [tokey]);
            return response;
        } catch (error) {
            throw error;
        }
    }
    

    async function serchByuse(use: Number) {
        try {
            const query = "SELECT * FROM user WHERE use LIKE ?"
            const response = await database.getAllAsync<UserDatabase>(query,`%${use}%`)
            return response
        } catch (error) {            
        }
    }


    async function update(tokey: string) {
        speaker()
        const stateament = await database.prepareAsync(
            "UPDATE user SET use = 1 WHERE tokey = $tokey"
        )
        try{
            await stateament.executeAsync({
                $tokey:tokey
            })
        }catch(error){
        throw error
        }finally{
            await stateament.finalizeAsync()
        }
    }
    async function delet(tokey: string) {
        const stateament = await database.prepareAsync(
            "DELETE FROM user where tokey = $tokey"
        )
        try {
            await stateament.executeAsync({
                $tokey:String(tokey)
        })
        } catch (error) {
            throw error
        }
        finally{
            await stateament.finalizeAsync()
        }
    }
    return {speaker,create,serchByuse, serchByTokey,update,delet}
}