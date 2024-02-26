import { useEffect, useState } from "react";

import "./App.css";
import BolderText from "./components/BolderText";
import MultiSelect from "./MultiSelect";
import { Character } from "./types";
import { RowData } from "./MultiSelect/types";

function App() {
	const [data, setData] = useState<Character[]>([]);
	const [value, setValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [exception, setException] = useState(null);

	const fetchData = async (filter?: string): Promise<Character[]> => {
		setLoading(true);
		return fetch(
			`https://rickandmortyapi.com/api/character${
				filter ? "/?name=" + filter : ""
			}`
		)
			.then((data) => {
				setLoading(false);
				setException(null);
				return data.json();
			})
			.then(({ error, results }) => {
				if (error) setException(error);
				return results || [];
			})
			.catch((e) => {
				setException(e);
				setLoading(false);
			});
	};

	const getData = async (nameFilter?: string) => {
		const apiData = await fetchData(nameFilter);
		setData(apiData);
	};

	const handleOnChange = (value: string) => {
		setValue(value);
		getData(value);
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<div className="container">
			<h3>Rick & Morty Characters</h3>
			<MultiSelect
				data={data.map(({ id, name, image, episode }: Character) => ({
					key: id,
					label: name,
					episode,
					image,
				}))}
				value={value}
				onChange={handleOnChange}
				placeholder="Search"
				loading={loading}
				exception={exception}
				renderItem={(d: RowData) => {
					return (
						<>
							<div className="image-container">
								<img
									alt={d.name}
									src={d.image}
									className="avatar"
								/>
							</div>
							<div className="info-container">
								<p className="character-name">
									<BolderText text={d.label} bolder={value} />
								</p>
								<p className="episode-count">
									{d.episode.length} Episodes
								</p>
							</div>
						</>
					);
				}}
			/>
		</div>
	);
}

export default App;
