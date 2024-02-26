import { ReactNode, useEffect, useRef, useState } from "react";
import "./style.css";
import { RowData } from "./types";
import Exception from "./components/Exception";

const MultiSelect = ({
	data,
	renderItem,
	loading,
	onChange,
	onSelect,
	value,
	placeholder,
	exception,
}: {
	data: RowData[];
	renderItem?: (item: RowData) => ReactNode | undefined;
	onSelect?: (selectedItems: RowData[]) => void;
	onChange?: (value: string) => void;
	loading?: false | boolean;
	value?: string;
	placeholder?: string;
	exception?: string | null;
}) => {
	const [selected, setSelected] = useState<RowData[]>([]);
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(value);

	const handleOpenDropDown = () => {
		setDropdownOpen((dropdownOpen) => !dropdownOpen);
	};

	const handleSelect = (key: number | string, rowData: RowData) => {
		setSelected((selected) => {
			const checked = selected.findIndex((s) => s.key === key) !== -1;
			const finalData = checked
				? selected.filter((s) => s.key !== key)
				: [...selected, rowData];
			if (onSelect) onSelect(finalData);
			return finalData;
		});
	};
	const handleInputChange = (value: string) => {
		if (onChange) onChange(value);
		setInputValue(value);
	};

	useEffect(() => {
		if (inputValue?.trim() !== "") {
			setDropdownOpen(true);
		}
	}, [inputValue]);

	const selectRef = useRef(null);

	const useOutsideClick = (
		ref: Element | null,
		onClickOut: () => void,
		deps = []
	) => {
		useEffect(() => {
			if (ref) {
				document.addEventListener("click", onClickOut);
				return () => document.removeEventListener("click", onClickOut);
			}
		}, [ref, ...deps]);
	};

	const handleInputKey = (e: any) => {
		if (!inputValue && e.key === "Backspace" && selected.length > 0) {
			const current = [...selected];
			current.pop();
			setSelected(current);
			if (onSelect) onSelect(current);
		}
	};

	useOutsideClick(selectRef.current, () => {
		setDropdownOpen(false);
	});

	return (
		<div ref={selectRef} onClick={(e) => e.stopPropagation()}>
			<div className="input-container">
				{selected.map((s: RowData) => (
					<div key={s.key} className="selected-item">
						{s.selectedLabelKey ? s[s.selectedLabelKey] : s.label}
						<button
							className="item-delete-button"
							onClick={() =>
								setSelected((selected) =>
									selected.filter((sel) => sel.key !== s.key)
								)
							}
						>
							X
						</button>
					</div>
				))}
				<input
					onKeyDown={handleInputKey}
					onClick={() => {
						if (selected.length === 0) handleOpenDropDown();
					}}
					className="search-input"
					placeholder={placeholder}
					value={inputValue}
					onChange={(e) => handleInputChange(e.target.value)}
				/>
				<button className="down-arrow" onClick={handleOpenDropDown}>
					▽
				</button>
			</div>
			{dropdownOpen && (
				<>
					<div className="search-list">
						{loading && data.length === 0 ? (
							<div className="loading-info">Loading</div>
						) : (
							<ul>
								{exception && (
									<Exception exception={exception} />
								)}
								{data.length > 0 &&
									data.map((d: RowData) => (
										<li
											key={d.key}
											onClick={(e) => {
												e.stopPropagation();
												handleSelect(d.key, d);
											}}
										>
											<div className="list-item">
												<div className="image-container">
													<input
														type="checkbox"
														name=""
														id=""
														checked={
															selected.findIndex(
																(s) =>
																	s.key ===
																	d.key
															) !== -1
														}
														onChange={(e) => {
															e.target.checked =
																true;
														}}
													/>
												</div>
												{renderItem
													? renderItem(d)
													: d.label}
											</div>
										</li>
									))}
							</ul>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default MultiSelect;
