import axios from 'axios';

export async function req(url: string): Promise<any> {
  const headers = {
    "Accept": "application/json",
    "AcceptEncoding": "gzip, deflate",
    "Authorization": process.env.API_KEY,
  };
  const response = await axios.get(url, { headers });
  return response.data;
}
