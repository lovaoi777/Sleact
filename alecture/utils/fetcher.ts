import axios from 'axios';
// const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

// export default fetcher;

//🔥메모
//withCredentials => 쿠키 생성해줌
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export default fetcher;
