using Microsoft.Extensions.Caching.Memory;

namespace MediaCritica.Server.Helpers
{

    public class ImageValidator(IMemoryCache cache)
    {
        private readonly IMemoryCache _cache = cache;

        public async Task<string?> GetValidImageUrlAsync(string? url)
        {
            if (string.IsNullOrWhiteSpace(url) || url == "N/A")
                return null;

            if (_cache.TryGetValue(url, out bool isValid))
                return isValid ? url : null;

            try
            {
                using var response = await new HttpClient().SendAsync(
                    new HttpRequestMessage(HttpMethod.Head, url));

                isValid = response.IsSuccessStatusCode &&
                          response.Content.Headers.ContentType?.MediaType?.StartsWith("image") == true;

                _cache.Set(url, isValid, TimeSpan.FromDays(7));

                return isValid ? url : null;
            }
            catch
            {
                _cache.Set(url, false, TimeSpan.FromDays(7));
                return null;
            }
        }
    }

}
