export default function initializePendo({ visitorId }) {
    pendo.initialize({
        visitor: {
            id: visitorId
        }
    })
}
