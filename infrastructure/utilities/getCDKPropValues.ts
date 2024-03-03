const getAccount = () => {
    if (process.env.CDK_DEFAULT_ACCOUNT) {
        return process.env.CDK_DEFAULT_ACCOUNT;
    } else {
        throw new Error('CDK_DEFAULT_ACCOUNT not found...');
    }
}

const getRegion = () => {
    if (process.env.CDK_DEFAULT_REGION) {
        return process.env.CDK_DEFAULT_REGION;
    } else {
        throw new Error('CDK_DEFAULT_REGION not found...');
    }
}

const getBucket = () => {
    if (process.env.BUCKET_NAME) {
        return process.env.BUCKET_NAME;
    } else {
        throw new Error('BUCKET_NAME not found...');
    }
}

export  { getAccount, getRegion, getBucket };