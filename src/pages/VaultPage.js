import React, { useContext, useEffect, useMemo, useState } from "react";
import "./VaultPage.css";
import NavigationPanel from "../components/Navbar/NavigationPanel";
import { VaultContext } from "../context/VaultContext";
import PasswordList from "../components/Vault/PasswordList/PasswordList";
import Loading from "../components/UI/loading/Loading";
import MyModal from "../components/UI/modal/MyModal";
import RecordModal from "../modals/RecordModal";
import OptionsSelect from "../components/UI/select/OptionsSelect";
import {
  createRecord,
  updateRecord,
  deleteRecord,
  createCategory,
  updateCategory,
  deleteCategory,
  createCard,
  updateCard,
  deleteCard,
} from "../services/vaultService";
import ErrorNotifications from "../components/Vault/ErrorNotifications";
import SidePanel from "../components/Vault/SidePanel/SidePanel";
import EmptyVault from "../components/Vault/EmptyVault/EmptyVault";
import FilterIndicator from "../components/Vault/FilterIndicator/FilterIndicator";
import CardList from "../components/Vault/CardList/CardList"; // New import for CardList component

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
    { label: "Банковская карта", modalName: "modal-new-card" },
  ];

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'record', 'card', 'all'

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

  const handleSaveRecord = async (record) => {
    try {
      const isNewRecord = !record.id;
      const response = isNewRecord
        ? await createRecord(record)
        : await updateRecord(record);

      setRecords((prevRecords) => {
        if (isNewRecord) {
          record.id = response.data.id;
          // Добавляем новую запись с id из ответа сервера
          return [...prevRecords, record];
        } else {
          // Обновляем запись в списке, используя данные из ответа сервера
          return prevRecords.map((r) =>
            r.id === record.id ? { ...record, ...response } : r
          );
        }
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      // handleCloseModal();
    }
  };

  const handleSaveCategory = async (category) => {
    try {
      const isNewCategory = !category.id;
      const response = isNewCategory
        ? await createCategory(category)
        : await updateCategory(category);
      setCategories((prevCategories) => {
        if (isNewCategory) {
          return [...prevCategories, category];
        } else {
          return prevCategories.map((c) =>
            c.id === category.id ? category : c
          );
        }
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleSaveCard = async (card) => {
    try {
      const isNewCard = !card.id;
      const response = isNewCard
        ? await createCard(card)
        : await updateCard(card);

      setCards((prevCards) => {
        if (isNewCard) {
          card.id = response.data.id;
          // Добавляем новую запись с id из ответа сервера
          return [...prevCards, card];
        } else {
          // Обновляем запись в списке, используя даннные из ответа сервера
          return prevCards.map((c) =>
            c.id === card.id ? { ...card, ...response } : c
          );
        }
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      // handleCloseModal();
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await deleteRecord(recordId);

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordId)
      );
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);

      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      handleError(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleSave = (type, data) => {
    if (type === "record") {
      handleSaveRecord(data);
    } else if (type === "category") {
      handleSaveCategory(data);
    } else if (type === "card") {
      handleSaveCard(data);
    }
  };

  const handleDelete = (type, data) => {
    if (type === "record") {
      handleDeleteRecord(data.id);
    } else if (type === "category") {
      handleDeleteCategory(data.id);
    } else if (type === "card") {
      handleDeleteCard(data.id);
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
      ) : records.length === 0 ? (
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
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      </MyModal>
    </div>
  );
};

export default VaultPage;
