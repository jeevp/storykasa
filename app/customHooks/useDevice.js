import { useEffect, useState } from 'react'

export default function useDevice() {
    const [onMobile, setOnMobile] = useState(false)
    const [onTablet, setOnTablet] = useState(false)
    const [screenWidth, setScreenWidth] = useState(0)

    useEffect(() => {
        handleDevice()
        window.addEventListener('resize', handleDevice)
    }, [])

    // Method
    const handleDevice = () => {
        const { width, height } = window?.screen

        setOnMobile(width <= 850 || height <= 410)
        setOnTablet(width <= 1024)
        setScreenWidth(width)
    }

    return { onMobile, onTablet, screenWidth }
}
