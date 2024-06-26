import React, { useContext, useEffect, useMemo, useState } from "react";
import "./VaultPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList/PasswordList";
import Loading from "../components/UI/loading/Loading";
import MyModal from "../components/UI/modal/MyModal";
import RecordModal from "../modals/RecordModal";
import OptionsSelect from "../components/UI/select/OptionsSelect";
import ErrorNotifications from "../components/Vault/ErrorNotifications";
import SidePanel from "../components/Vault/SidePanel/SidePanel";
import EmptyVault from "../components/Vault/EmptyVault/EmptyVault";
import FilterIndicator from "../components/Vault/FilterIndicator/FilterIndicator";
import CardList from "../components/Vault/CardList/CardList";
import { deleteObject, saveObject } from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, RECORDS_URL, CATEGORIES_URL, CARDS_URL } from "../config";

const VaultPage = () => {
  const {
    records,
    setRecords,
    cards,
    setCards,
    categories,
    setCategories,
    isLoadingRecords,
    error: vaultError,
  } = useContext(VaultContext);

  const options = [
    { label: "Запись", modalName: "modal-new-record" },
    { label: "Категорию", modalName: "modal-new-category" },
    { label: "Банковскую карту", modalName: "modal-new-card" },
  ];

  const { masterKey, authTokens } = useContext(AuthContext);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredRecords = useMemo(() => {
    const filteredBySearch = records.filter(
      (record) =>
        record.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredByCategory = filterByCategory
      ? filteredBySearch.filter(
          (record) => record.category === filterByCategory.id
        )
      : filteredBySearch;
    return filteredByCategory;
  }, [records, searchTerm, filterByCategory]);

  const filteredCards = useMemo(() => {
    const filteredBySearch = cards.filter(
      (card) =>
        card.card_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.card_number.slice(-4).includes(searchTerm) // предполагаем, что пользователь может искать по последним 4 цифрам номера карты
    );
    return filteredBySearch;
  }, [cards, searchTerm]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleFilterCategory = (category) => {
    setFilterByCategory(category);
  };

  const handleFilterType = (type) => {
    setFilterType(type);
  };

  const handleError = (errorMessage) => {
    setErrors((prevErrors) => [...prevErrors, errorMessage]);
  };

  const handleCloseError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handleOpenNewRecordModal = (event, modalName) => {
    event.preventDefault();
    if (modalName === "modal-new-record") {
      setModalType("record");
      setSelectedRecord(null);
      setModal(true);
    } else if (modalName === "modal-new-category") {
      setModalType("category");
      setSelectedCategory(null);
      setModal(true);
    } else if (modalName === "modal-new-card") {
      // Новый случай
      setModalType("card");
      setSelectedRecord(null);
      setModal(true);
    }
  };

  const handleOpenModal = (item, type) => {
    if (type === "record") {
      setModalType("record");
      setSelectedRecord(item);
    } else if (type === "card") {
      setModalType("card");
      setSelectedRecord(item); // возможно, вам нужно будет использовать другую функцию для установки выбранной карты
    }
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setModalType(null);
    setSelectedCategory(null);
    setSelectedRecord(null);
  };

  const handleSave = async (type, item) => {
    let url;
    let setFunction;
    switch (type) {
      case "record":
        url = BASE_URL + RECORDS_URL;
        setFunction = setRecords;
        break;
      case "category":
        url = BASE_URL + CATEGORIES_URL;
        setFunction = setCategories;
        break;
      case "card":
        url = BASE_URL + CARDS_URL;
        setFunction = setCards;
        break;
      default:
        return;
    }

    try {
      const response = await saveObject(
        url,
        item,
        masterKey,
        authTokens.access
      );
      setFunction((prevItems) => {
        if (!item.id) {
          item.id = response.data.id;
          return [...prevItems, item];
        } else {
          return prevItems.map((existingItem) =>
            existingItem.id === item.id
              ? { ...item, ...item.data }
              : existingItem
          );
        }
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (type, data) => {
    let url;
    let setFunction;
    switch (type) {
      case "record":
        url = BASE_URL + RECORDS_URL;
        setFunction = setRecords;
        break;
      case "category":
        url = BASE_URL + CATEGORIES_URL;
        setFunction = setCategories;
        break;
      case "card":
        url = BASE_URL + CARDS_URL;
        setFunction = setCards;
        break;
      default:
        return;
    }

    try {
      await deleteObject(url, data, masterKey, authTokens.access);
      setFunction((prevItems) =>
        prevItems.filter((item) => item.id !== data.id)
      );
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const displayedItems = useMemo(() => {
    if (filterType === "record") {
      return (
        <PasswordList
          records={filteredRecords}
          handleOpenModal={(record) => handleOpenModal(record, "record")}
        />
      );
    } else if (filterType === "card") {
      return (
        <CardList
          cards={filteredCards}
          handleOpenModal={(card) => handleOpenModal(card, "card")}
        />
      );
    } else {
      return (
        <>
          <PasswordList
            records={filteredRecords}
            handleOpenModal={(record) => handleOpenModal(record, "record")}
          />
          <CardList
            cards={filteredCards}
            handleOpenModal={(card) => handleOpenModal(card, "card")}
          />
        </>
      );
    }
  }, [filterType, filteredRecords, filteredCards]);

  return (
    <div>
      <ErrorNotifications
        errors={errors}
        vaultError={vaultError}
        handleCloseError={handleCloseError}
      />
      <NavigationPanel />

      {isLoadingRecords ? (
        <Loading />
      ) : records.length === 0 && cards.length === 0 ? (
        <div>
          <EmptyVault />
          <OptionsSelect
            options={options}
            handleOptionSelected={handleOpenNewRecordModal}
          />
        </div>
      ) : (
        <div className="main-content">
          <SidePanel
            categories={categories}
            onSearch={handleSearch}
            onFilterCategory={handleFilterCategory}
            onFilterType={handleFilterType}
            masterKey={masterKey}
            authToken={authTokens.access}
          />
          <div className="right-block">
            {(searchTerm || filterByCategory || filterType !== "all") && (
              <FilterIndicator
                searchTerm={searchTerm}
                filterType={filterType}
                filterByCategory={filterByCategory}
                onClearSearch={() => handleSearch("")}
                onClearCategory={() => handleFilterCategory(null)}
                onClearFilterType={() => handleFilterType("all")}
              />
            )}
            {displayedItems}
            <OptionsSelect
              options={options}
              handleOptionSelected={handleOpenNewRecordModal}
            />
          </div>
        </div>
      )}
      <MyModal visible={modal} setVisible={setModal}>
        <RecordModal
          record={selectedRecord}
          category={selectedCategory}
          categories={categories}
          modalType={modalType}
          onSave={(type, data) => handleSave(type, data)}
          onDelete={(type, data) => handleDelete(type, data)}
          onClose={handleCloseModal}
        />
      </MyModal>
    </div>
  );
};

export default VaultPage;
