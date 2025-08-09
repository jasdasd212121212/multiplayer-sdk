using System;
using System.IO;
using System.IO.Compression;
using System.Text;
using UnityEngine;

namespace Positron
{
    public class BrotlitInteractor
    {
        private int _compressThrashold = 256;

        private const string NON_COMPRESS_MARK = "NCNC;;;";

        public string CompressString(string inputString, int quality = 11)
        {
            if (string.IsNullOrEmpty(inputString))
            {
                return "";
            }

            if (inputString.Length >= _compressThrashold) 
            {
                return NON_COMPRESS_MARK + inputString;
            }

            try
            {
                byte[] data = Encoding.UTF8.GetBytes(inputString);

                using (MemoryStream outputStream = new MemoryStream())
                {
                    using (BrotliStream brotliStream = new BrotliStream(outputStream, CompressionMode.Compress, true))
                    {
                        BrotliEncoder brotliEncoder = new BrotliEncoder(quality, 10);
                        brotliStream.Write(data, 0, data.Length);
                    }

                    return Convert.ToBase64String(outputStream.ToArray());
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Critical error -> brotlit compression error: {e.Message}");
                return "";
            }
        }

        public string DecompressString(string compressedData)
        {
            if (compressedData == null || compressedData.Length == 0)
            {
                return "";
            }

            if (!IsCompressed(compressedData))
            {
                return compressedData.Substring(NON_COMPRESS_MARK.Length);
            }

            try
            {
                using (MemoryStream inputStream = new MemoryStream(Convert.FromBase64String(compressedData)))
                {
                    using (MemoryStream outputStream = new MemoryStream())
                    {
                        using (BrotliStream brotliStream = new BrotliStream(inputStream, CompressionMode.Decompress, true))
                        {
                            brotliStream.CopyTo(outputStream);
                        }

                        return Encoding.UTF8.GetString(outputStream.ToArray());
                    }
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Critical error -> brotlit decompression error: {e.Message} source: {compressedData}");
                return "";
            }
        }

        private bool IsCompressed(string input) => input.Substring(0, NON_COMPRESS_MARK.Length) != NON_COMPRESS_MARK;
    }
}