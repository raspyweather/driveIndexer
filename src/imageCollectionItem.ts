interface ImageCollectionItem {
    [key: number]: ImageCollectionSubItem[]
}

interface ImageCollectionSubItem {
    satelliteIdx: number,
    modeIdx: number,
    apiKeyIdx: number,
    id: string
}
