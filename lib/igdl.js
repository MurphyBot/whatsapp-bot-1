let axios = require('axios')
let cheerio = require('cheerio')
let getCookies = {
	"cookie": 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
}

if (!getCookies.cookie) getCookies = {}

async function InstaDownloader(url) {
	return new Promise (async (resolve, reject) => {
		const RegPost = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/p\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegReels = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/reel\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegIgTv = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/tv\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		try {
			if (RegPost) {
				let BaseUrlPost = `https://www.instagram.com/p/`
				const data = await axios({
					url: BaseUrlPost + RegPost[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const image = data.data.graphql.shortcode_media.edge_sidecar_to_children.edges.filter((v) => v.node.__typename === "GraphImage")
				const video = data.data.graphql.shortcode_media.edge_sidecar_to_children.edges.filter((v)  => v.node.__typename === "GraphVideo")
				const getData = []
				for (let result of image) {
					getData.push({ isVideo: false, url: result.node.display_url })
				}
				for (let result of video) {
					getData.push({ isVideo: true, url: result.node.video_url })
				}
				const format = {
					getData,
					caption: data.data.graphql.shortcode_media. edge_media_to_caption.edges[0].node. text,
					username: data.data.graphql.shortcode_media.owner.username,
					like: data.data.graphql.shortcode_media. edge_media_preview_like.count
				}
				return resolve(format)
			} else if (RegReels) {
				let BaseUrlReel = "https://www.instagram.com/reel/"
				const data = await axios({
					url: BaseUrlReel + RegReels[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const Format = {
					link: data.data.graphql.shortcode_media.video_url,
					total_views: data.data.graphql.shortcode_media.video_view_count,
					total_plays: data.data.graphql.shortcode_media.video_play_count,
					total_koment: data.data.graphql.shortcode_media.edge_media_preview_comment.count,
					username: data.data.graphql.shortcode_media.owner.username,
					durasi: data.data.graphql.shortcode_media.video_duration,
					thumbnail: data.data.graphql.shortcode_media.thumbnail_src,
					like: data.data.graphql.shortcode_media.edge_media_preview_like.count
				}
				return resolve(Format)
			} else if (RegIgTv) {
				let BaseUrlIgtv = "https://www.instagram.com/tv/"
				const data = await axios({
					url: BaseUrlIgtv + RegIgTv[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						...getCookies
					}
				})
				const Format = {
					link: data.data.graphql.shortcode_media.video_url,
					thumbnail: data.data.graphql.shortcode_media.thumbnail_src,
					title: data.data.graphql.shortcode_media.title,
					total_coment: data.data.graphql.shortcode_media.edge_media_preview_comment.count,
					total_view: data.data.graphql.shortcode_media.video_view_count,
					total_play: data.data.graphql.shortcode_media.video_play_count,
					username: data.data.graphql.shortcode_media.owner.username,
			
				}
				return resolve(Format)
			} else {
				return reject(new Error(String("Url Invalid")))
			}
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

module.exports = { InstaDownloader }