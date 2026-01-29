interface Props {
    target: string
}
export default function Result160(props:Props) {
    return ( 
        <><p className="font-semibold">Expected result</p>
        <p className="p-2 bg-gray-100 dark:bg-gray-700 break-words uppercase text-[13px] font-semibold tracking-wider">
          {props.target}
        </p>
        </>)
}