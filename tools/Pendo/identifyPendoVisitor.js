export default function identifyPendoVisitor({ userId }) {
    pendo.identify({
        visitor: {
            id: userId
        }
    })
}
