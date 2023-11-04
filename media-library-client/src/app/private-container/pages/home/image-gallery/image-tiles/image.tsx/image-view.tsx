import ImageProps from "./image-view-props"


export default function imageView({base64} : ImageProps) {

        return (
            <img src={`data:image/png;base64,${base64}`}/>
        )
}