import React, { useEffect, useState } from "react";
import ChangeRecordForm from "../components/ChangeRecordForm";
import AddRecordForm from "../components/AddRecordForm";
import PasswordGenerator from "../components/PasswordGenerator";
import { useCategoriesService, useRecordsService } from "../lib/vault-hooks";
import { useDebounce } from "@uidotdev/usehooks";

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [createForm, setCreateForm] = useState(false);
  const { getRecords, createRecord, updateRecord, deleteRecord } =
    useRecordsService();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { getCategories } = useCategoriesService();
  const [categories, setCategories] = useState([]);

  const [passwordGen, setPasswordGen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    const fetchRecords = async () => {
      const records = await getRecords();
      const filteredRecords = filterRecords(
        records,
        selectedCategory,
        debouncedSearchText,
      );
      setRecords(filteredRecords);
    };

    fetchCategories();
    fetchRecords();
  }, [debouncedSearchText, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchText(e.target?.value ?? "");
  };

  const filterRecords = (records, selectedCategory, searchText) => {
    if (!searchText & !selectedCategory) {
      return records;
    }
    const lowercaseSearchText = searchText ? searchText.toLowerCase() : "";

    return records.filter((record) => {
      const { app_name, username, url, category } = record;
      const matchesSearch =
        (app_name && app_name.toLowerCase().includes(lowercaseSearchText)) ||
        (username && username.toLowerCase().includes(lowercaseSearchText)) ||
        (url && url.toLowerCase().includes(lowercaseSearchText));
      const matchesCategory =
        !selectedCategory || category?.id === selectedCategory.id;

      return matchesSearch && matchesCategory;
    });
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
  };

  const handleCloseForm = () => {
    setEditingRecord(null);
  };

  const handleRecordUpdated = (updatedRecord) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record,
      ),
    );
  };

  const handleAddRecord = () => {
    setCreateForm(true);
  };

  const handleCloseAddRecordForm = () => {
    setCreateForm(false);
  };

  const handleRecordCreated = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  const handleDeleteRecord = async (recordId) => {
    const deleted = await deleteRecord(recordId);
    if (deleted) {
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordId),
      );
    }
    setEditingRecord(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const showPasswordGenerator = () => {
    !passwordGen ? setPasswordGen(true) : setPasswordGen(false);
  };

  return (
    <div>
      <p>Hello. This is home page!</p>
      <button onClick={showPasswordGenerator}>Генератор паролей</button>
      <div>{passwordGen && <PasswordGenerator />}</div>
      <ul>
        <li onClick={() => handleCategorySelect(null)}>Все категории</li>
        {categories.map((category) => (
          <li key={category.id} onClick={() => handleCategorySelect(category)}>
            {category.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Поиск..."
        value={searchText}
        onChange={handleSearchChange}
      />
      <p>
        <button onClick={handleAddRecord}>Add Record</button>
      </p>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <h5 onClick={() => handleEditRecord(record)}>{record.app_name}</h5>
            <button onClick={() => handleDeleteRecord(record.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {editingRecord && (
        <ChangeRecordForm
          record={editingRecord}
          onCloseForm={handleCloseForm}
          updateRecord={updateRecord}
          onRecordUpdated={handleRecordUpdated}
        />
      )}
      {createForm && (
        <AddRecordForm
          createRecord={createRecord}
          onClose={handleCloseAddRecordForm}
          onRecordCreated={handleRecordCreated}
        />
      )}
    </div>
  );
};

export default HomePage;
