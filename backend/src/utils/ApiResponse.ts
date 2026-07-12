class ApiResponse <T> {
    success:boolean;
    message:string;
    data? : T

    constructor(success:boolean, message:string, data? : T){
        this.data=data;
        this.success = success;
        this.message = message;
    }
}
export default ApiResponse;