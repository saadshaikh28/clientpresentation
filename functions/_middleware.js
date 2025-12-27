export async function onRequest(context) {
    const { request, next, env } = context;
    const url = new URL(request.url);
    const userAgent = request.headers.get("user-agent") || "";

    // Bot detection: WhatsApp, Facebook, LinkedIn, Twitter, Slack, etc.
    const botRegex = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot-LinkExpanding|Embedly/i;
    const isBot = botRegex.test(userAgent);

    if (isBot) {
        const configUrl = new URL("/configs/default.json", url.origin);
        let config = {};
        try {
            const configResp = await fetch(configUrl);
            if (configResp.ok) {
                config = await configResp.json();
            }
        } catch (e) {
            console.error("Failed to load config", e);
        }

        const response = await next();
        const businessName = config.companyName || config.name || "AC System Pro";
        const title = `Smart Website for ${businessName}`;
        const description = `Personalized demo website for ${businessName}. Increase leads and Google Reviews automatically.`;
        // Using a common free screenshot service for dynamic previews
        const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url.origin)}?w=1200&h=630`;

        return new HTMLRewriter()
            .on("title", {
                element(e) {
                    e.setInnerContent(title);
                }
            })
            .on("meta[name='description']", {
                element(e) {
                    e.setAttribute("content", description);
                }
            })
            .on("head", {
                element(e) {
                    e.append(`<meta property="og:title" content="${title}" />`, { html: true });
                    e.append(`<meta property="og:description" content="${description}" />`, { html: true });
                    e.append(`<meta property="og:image" content="${screenshotUrl}" />`, { html: true });
                    e.append(`<meta property="og:url" content="${url.origin}" />`, { html: true });
                    e.append(`<meta property="og:type" content="website" />`, { html: true });
                    e.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
                }
            })
            .transform(response);
    }

    return next();
}
