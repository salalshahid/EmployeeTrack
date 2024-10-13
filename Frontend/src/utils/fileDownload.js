export const triggerDownload = async(blob) => {
    try {
        if (blob instanceof Blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "time_log.pdf");  // Example filename
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            console.error("The server response is not a blob.");
          }
    } catch (error) {
        console.error('Download failed', error);
    }
};