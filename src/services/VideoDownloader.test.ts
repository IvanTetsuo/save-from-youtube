import { videoDownloader } from "./VideoDownloader";
const { getVideoFileName } = videoDownloader;

test('Результатом должен быть token + _video.mp4', () => {
    expect( getVideoFileName('1')).toBe('1_video.mp4')
})