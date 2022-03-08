import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Highlight, { defaultProps } from "prism-react-renderer";
import tableAtlas from "./tables";

function App() {
	const [tables, setTables] = useState([]);
	const [activeTable, setActiveTable] = useState(-1);
	const [activeRow, setActiveRow] = useState();
	const [file, setFile] = useState([]);
	const [result, setResult] = useState("");

	useEffect(() => {
		for (let key in tableAtlas) {
			if (tableAtlas.hasOwnProperty(key)) {
				setTables((prevState) => [...prevState, key]);
			}
		}
	}, []);

	useEffect(() => {
		setActiveRow(tableAtlas[tables[activeTable]]);
		document.querySelector("#formFile").value = "";
		document.title = `${tables[activeTable]} - QB`;
	}, [tables, activeTable]);

	function handleFileChange(event) {
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function (event) {
			let fl = [];

			var f = event.target.result;
			var lines = f.split("\n");

			lines.forEach((line) => {
				var j = line.split(",");

				if (j[0] !== "") {
					var varr = [];

					j.forEach((el) => {
						console.log(activeRow.length);
						if (varr.length < activeRow.length) {
							varr.push(el);
						}
					});

					fl.push(varr);
				}
			});

			console.log(fl);

			setFile(fl);
		};

		reader.readAsText(file);
	}

	function calculate(e) {
		e.preventDefault();

		let res = "";

		file.forEach((line) => {
			let q = "INSERT INTO " + tables[activeTable] + " (";

			activeRow.forEach((row, ind) => {
				if (ind === activeRow.length - 1) {
					q += `${row}`;
				} else {
					q += `${row}, `;
				}
			});

			q += ") VALUES (";

			line.forEach((row, ind) => {
				if (ind === line.length - 1) {
					q += `"${row.trim()}"`;
				} else {
					q += `"${row.trim()}", `;
				}
			});

			q += ");";

			res += q + "\n";
		});

		setResult(res);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Query Builder</h1>
				<p> v3</p>
				<br />
				<form onSubmit={calculate}>
					<div className="input-group mb-3">
						<select
							className="form-select"
							aria-label="Default select example"
							onChange={(e) => {
								setActiveTable(e.target.value);
								setFile([]);
							}}
							value={activeTable}
						>
							<option value={-1}>Select a table...</option>
							{tables.map((table, id) => {
								return (
									<option key={id.toString()} value={id}>
										{table}
									</option>
								);
							})}
						</select>
					</div>
					<br />
					<div className="mb-3">
						<label htmlFor="formFile" className="form-label">
							Upload CSV
						</label>
						<input
							className="form-control"
							type="file"
							id="formFile"
							accept=".csv"
							onChange={handleFileChange}
						/>
					</div>
					<br />
					<table className="table text-white">
						<thead>
							<tr>
								{activeRow
									? activeRow.map((i) => <td key={i}>{i}</td>)
									: null}
							</tr>
						</thead>
						<tbody>
							{file
								? file.map((row, id) => (
										<tr key={id.toString()}>
											{row.map((d, eid) => (
												<td key={`${id}:${eid}`}>
													{d}
												</td>
											))}
										</tr>
								  ))
								: null}
						</tbody>
					</table>

					<button type="submit" className="btn btn-primary">
						Build
					</button>

					<br />
					<br />
				</form>
				<h2> Results:</h2>
				<Highlight {...defaultProps} code={result} language="sql">
					{({
						className,
						style,
						tokens,
						getLineProps,
						getTokenProps,
					}) => (
						<pre
							className={className}
							style={{ fontSize: "14px", ...style }}
						>
							{tokens.map((line, i) => (
								<div {...getLineProps({ line, key: i })}>
									{line.map((token, key) => (
										<span
											{...getTokenProps({ token, key })}
										/>
									))}
								</div>
							))}
						</pre>
					)}
				</Highlight>
			</header>
		</div>
	);
}

export default App;
