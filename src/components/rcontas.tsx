
import {Pressable ,PressableProps,Text} from 'react-native';

type Props = PressableProps&{
    data:{    
        tokey:string
        use: number
        name:string
        vendedor:number
    }
}


export function Rconta({data, ...rest}:Props){
    return <Pressable style={{
        backgroundColor:"#cecece",
        padding:24,borderRadius:5,
        gap:12,
        flexDirection:"row"
        }}
         {...rest}>
        <Text>
          -{data.name}
        </Text>
    </Pressable>
}