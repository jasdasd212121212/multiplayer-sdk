interface IRaiseEventPackege{
    type: number;
    targets: number;
    sourceObjectId: number;
    additionalIndex: number;
    targetClient: number;
    payload: object;
}

export { IRaiseEventPackege }