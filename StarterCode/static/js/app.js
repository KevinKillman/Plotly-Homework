


d3.json('./data/samples.json').then(data => {
    var dropdown = d3.select("#selDataset");
    var meta = d3.select("#sample-metadata")
    var id = data.samples.map(element => element.id);
    // console.log(data.metadata)
    id.forEach(x => {
        d3.select("#selDataset").append("option").text(x);
    });
    
    data.samples.forEach(element => {
        element.sample_values.forEach(element2 => element2 = +element2)
        element.otu_ids.forEach(element3 => element3 = String(element3))
    });


    // Would have liked to pull the element ID from the dropdown to make it dynamic
    // Could not figure it out in time
    var init_chart = data.samples.filter(element => element.id == "940")[0]
    var init_meta = data.metadata.filter(element => element.id == "940")[0]
    Object.entries(init_meta).forEach(k => {
        meta.append("p").text(`${k[0]} : ${k[1]}`)
    });
    var otuSort = [];
    var topTenOtu = [];
    init_chart.sample_values.forEach((d,i) => {
        otuSort.push([init_chart.otu_ids[i], d, init_chart.otu_labels[i]]);

    });
    otuSort.sort((a,b) => b[1]-a[1]);
    for(var i = 0; i<10;i++){
        topTenOtu.push(otuSort[i]);
    };
    var trace1 = {
        x: topTenOtu.map(element => element[1]),
        y: topTenOtu.map(element => "OTU " + String(element[0])),
        text: topTenOtu.map(element => element[2]),
        type:'bar',
        orientation: 'h'
    };
    var layout = {
        title: `Subject ID: ${init_chart.id}`,
        yaxis: {type: 'category'}
    };
    var plot_data = [trace1]
    Plotly.newPlot('bar', plot_data, layout)
    // console.log(init_chart.sample_values)

    var traceBubble = {
        x: init_chart.otu_ids,
        y: init_chart.sample_values,
        mode: 'markers',
        text: init_chart.otu_labels,
        marker: {
            size: init_chart.sample_values,
            color: init_chart.otu_ids
        }
    }
    // console.log(init_chart)
    var layoutBubble = {
        title: 'Bacteria',
        xaxis: {
            title: 'OTU ID',

        },
        yaxis: {
            title: 'Sample Value'
        }
        
    }
    var dataBubble = [traceBubble]
    Plotly.newPlot('bubble', dataBubble, layoutBubble)



    dropdown.on('change', event => {
        var target = data.samples.filter(element => element.id == d3.event.target.value)[0]
        var meta_target = data.metadata.filter(element => element.id == d3.event.target.value)[0]
        var otuSort = [];
        var topTenOtu = [];
        // console.log(target.sample_values);
        target.sample_values.forEach((d,i) => {
            otuSort.push([target.otu_ids[i], d, target.otu_labels[i]]);

        });
        otuSort.sort((a,b) => b[1]-a[1])
        if (otuSort.length >10) {
            for(var i = 0; i<10;i++){
                topTenOtu.push(otuSort[i])
            }
        } else {
            topTenOtu=otuSort
        };  
        // console.log(topTenOtu)
        var values = {
            x: topTenOtu.map(element => element[1]),
            y: topTenOtu.map(element => "OTU " + String(element[0])),
            text: topTenOtu.map(element => element[2])

        };
        // console.log(target)
        meta.text(" ")
        Object.entries(meta_target).forEach(k => {
            meta.append("p").text(`${k[0]} : ${k[1]}`)
        });
        Plotly.restyle('bar', 'x', [values.x]);
        Plotly.restyle('bar', 'y', [values.y]);
        Plotly.restyle('bar', 'text', [values.text]);
        var update = {
            title : `Subject ID : ${d3.event.target.value}`
        };
        Plotly.relayout('bar', update);
        Plotly.restyle('bubble', 'x', [target.otu_ids]);
        Plotly.restyle('bubble', 'y', [target.sample_values]);
        Plotly.restyle('bubble', 'text', [target.otu_labels]);
        var updateBubble = {
            marker: {
                size: target.sample_values,
                color: target.otu_ids
            },
            
        }
        Plotly.restyle('bubble', updateBubble)
    })
    








    var sample_values = data.samples.map(element => element.sample_values);
    var otu_ids = data.samples.map(element => element.otu_ids)
    // console.log(data.samples)
});



