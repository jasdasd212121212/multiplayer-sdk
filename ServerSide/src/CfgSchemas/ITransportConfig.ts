export interface ITransportConfig{
    host: string;
    port: number;
    securityDefinition: ISecuriteDefinition;
    security: ISecurity;
}

interface ISecuriteDefinition{
    useSSL: boolean;
    useAuth: boolean;
}

interface ISecurity{
    CORS: string;
    SSL_Cert: string;
    SSL_Key: string;
    AuthKey: string;
}