import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') })
import { Command } from 'commander'
import axios from 'axios';

// import api key from .env file
const apiKey = process.env.OPENAI_KEY;


export const getModels = async (): Promise<any> => {
    try {
        const options = {
            method: 'GET',
            url: 'https://api.openai.com/v1/models',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            json: true
        };
    
        const response = await axios.get(options.url, {headers: options.headers});
        return response.data.data;
    } catch (err) {
        console.log(err)
    }
}

export const getModelIds = async (): Promise<any> => {
    try {
        const models = await getModels();
        const modelIds = models.map((model: any) => model.id);
        return modelIds;
    } catch (err) {
        console.log(err)
    }
}

export const getCompletion = async (prompt: string): Promise<any> => {
    const options = {
        url: 'https://api.openai.com/v1/completions',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: {
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        },
        json: true
    };

    const response = await axios.post(options.url, options.body, {headers: options.headers});
    return response.data;
}

const program = new Command()

program.name('openai-cli')
 
program.command('ask')
    .description('Answers the given prompt')
    .option('-q, --question <string>', 'Question')
    .action(async (options: any) => {
        try {
            const { question } = options;
            const response = await getCompletion(question);
            console.log(response);
        } catch (err: any) {
            console.log(err.response.data.error.message)
        }
    })

program.parse()


