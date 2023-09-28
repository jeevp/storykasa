export default function Record(options = { fill: "#333" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={options.fill} viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z">
            </path>
            <circle cx="128" cy="128" r="72"></circle>
        </svg>
    )
}
