class CustomErrorHandler extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message =message;
    }

    //static method ko call karne ke liye humko class ka bject banane kii 
    //jrurat nii hoti  isliye hum static bna rhe hai
    //message humko wha se recive hoga jha se hum isko call karenge  
    static alreadyExist(message) {
        return new CustomErrorHandler(409,message);
    }
}

export default CustomErrorHandler;