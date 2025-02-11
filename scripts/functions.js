function getApiArray(url) {
    $.ajax({
        url: url,
        type: "GET",
        success: data => {
            let arr = [];
            String(data).substring(0, data.length-1).split(';').forEach(d => {
                arr.push(d);
            })

            return arr;
        },
        error: err => {
            console.error(`Error fetching data: `, err);
        }
    });
}