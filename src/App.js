import React, { useState, useEffect } from "react";
import { Bar, Radar, defaults } from "react-chartjs-2";
import "./App.css";

function App() {
  const [tableRows, setTableRows] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentRow, setCurrentRow] = useState("");

  const getData = async () => {
    let requestedData = await fetch("https://demo6922545.mockable.io/");
    const parsedData = await requestedData.json();

    const dataSortedByOverallAssociationScore = parsedData.data.sort((a, b) => {
      return b.association_score.overall - a.association_score.overall;
    });

    const topFiveTargets = [...dataSortedByOverallAssociationScore].splice(
      0,
      5
    );

    return topFiveTargets;
  };

  const runShowDetails = (rowId, currentRowId) => {
    setShowDetails(true);
    setCurrentRow(rowId);

    if (showDetails && currentRowId === rowId) {
      setShowDetails(false);
    }
  };

  const rowDetails = (rowId, currentRowId, dataTypes) => {
    defaults.global.title.display = true;
    defaults.global.title.text = "Association Score vs Data Type";
    defaults.global.legend = false;

    if (showDetails && currentRowId === rowId) {
      return (
        <tr>
          <td colSpan={5}>
            <div id="associationCharts">
              <Bar
                data={{
                  labels: [
                    "literature",
                    "rna_expression",
                    "genetic_association",
                    "somatic_mutation",
                    "known_drug",
                    "animal_model",
                    "affected_pathway",
                  ],
                  datasets: [
                    {
                      label: "Data Type",
                      data: [
                        dataTypes.literature,
                        dataTypes.rna_expression,
                        dataTypes.genetic_association,
                        dataTypes.somatic_mutation,
                        dataTypes.known_drug,
                        dataTypes.animal_model,
                        dataTypes.affected_pathway,
                      ],
                      backgroundColor: "lightblue",
                    },
                  ],
                  xAxisID: "hello",
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        scaleLabel: {
                          display: true,
                          labelString: "Score",
                        },
                      },
                    ],

                    xAxes: [
                      {
                        scaleLabel: {
                          display: true,
                          labelString: "Score",
                        },
                      },
                    ],
                  },
                }}
              />

              <Radar
                data={{
                  labels: [
                    "literature",
                    "rna_expression",
                    "genetic_association",
                    "somatic_mutation",
                    "known_drug",
                    "animal_model",
                    "affected_pathway",
                  ],
                  datasets: [
                    {
                      label: "Data Type",
                      data: [
                        dataTypes.literature,
                        dataTypes.rna_expression,
                        dataTypes.genetic_association,
                        dataTypes.somatic_mutation,
                        dataTypes.known_drug,
                        dataTypes.animal_model,
                        dataTypes.affected_pathway,
                      ],
                      backgroundColor: "lightblue",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </td>
        </tr>
      );
    } else return null;
  };

  const dataTable = async () => {
    const data = await getData();

    let mapTableRows = data?.map((data) => {
      return (
        <>
          <tr>
            <td
              onClick={() => runShowDetails(data.target.id, currentRow)}
              style={{ cursor: "pointer" }}
            >
              +
            </td>
            <td>{data.target.gene_info.symbol}</td>
            <td>{data.target.id}</td>
            <td>{data.target.gene_info.name}</td>
            <td>{data.association_score.overall}</td>
          </tr>
          {rowDetails(
            data.target.id,
            currentRow,
            data.association_score.datatypes
          )}
        </>
      );
    });

    setTableRows(mapTableRows);
  };

  useEffect(() => {
    dataTable();
  }, [showDetails, currentRow]);

  return (
    <div className="App">
      <table>
        <caption>
          <h1>Genes associated with lung carcinoma</h1>
        </caption>
        <tbody>
          <tr>
            <th> </th>
            <th>Symbol</th>
            <th>Gene ID</th>
            <th>Gene Name</th>
            <th>Overall Association Score</th>
          </tr>
          {tableRows}
        </tbody>
      </table>
      <br />
    </div>
  );
}

export default App;
