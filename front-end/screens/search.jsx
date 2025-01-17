import { View, Text, StyleSheet, TouchableOpacity, TextInput,Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import axios from "axios"
import {AdresseIPPP_} from '@env'
import ModalSearch from '../modals/modalSearch'
import { useAuth } from "../components/authcontext/authcontext";
import styles from "../styleScreens/styleSearch"
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../toastProvider/toast";
import { useTranslation } from 'react-i18next'
const Search = () => {
   const {searchInput, setSearchInput,ProductSearch,isProductInWishlist,infor,setrefreshh,refreshh,setProdSearch} = useAuth()
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectSearch,setSelectsearch]=useState('')
 const navigation = useNavigation();
 const { showToast } = useToast();
 const { t} = useTranslation()

 const searchwithBar=(name)=>{
  setSearchInput(name)
  axios.get(`${AdresseIPPP_}/api/search/BarSearch/${name}`)
  .then((response)=>{
    setProdSearch(response.data)
    
    setFilteredData([]);
  })
  .catch((err)=>console.log(err)) 
}
 

  const addtoWishlist=(product)=>{
    axios.post(`${AdresseIPPP_}/api/wishlist/add/${infor.id}`,{
      productId: product
  }).then((res)=>{
      console.log(res.data)
      
      setrefreshh(!refreshh) 
      showToast(t('search:toastAdedWishlist'))
    }).catch((error)=>{console.log(error)})
  }
  
  deleteFavoriteItem=(id)=>{
    axios.delete(`${AdresseIPPP_}/api/wishlist/delete/${id}`)
    .then((res) => {
         showToast(t('search:toastDeleteWishlist'),"red")
     setrefreshh(!refreshh)
   })
   .catch((error) => {
     console.log("oops");
       
   });
  }

useEffect(()=>{
    if(searchInput===""){
        setFilteredData([])
        setProdSearch([])
    }else{ 
    axios.get(`${AdresseIPPP_}/api/search/BarSearch/${searchInput}`)
    .then((response)=>{
        
        setFilteredData(response.data)
    })
    .catch((err)=>console.log(err)) }
},[searchInput])

const Item = ({item}) => {
    return(
     
    <View style={styles.item}>
      
    <TouchableOpacity onPress={()=>navigation.navigate("ProductDetails", { productId: item.id, sellerId: item.userId,price:item.price })}>
          <Image  source={{ uri: item.img1 }} style={styles.image} />
    </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={{width:85,left:10}} >
        <Text style={styles.price}> {t('search:price')}:{item.price}</Text>
        <Text style={styles.length}> {t('search:length')}: {item.length}</Text>
        <Text style={styles.width}> {t('search:width')}: {item.width}</Text>
        </View>
        
      </View>
      {infor.role==="buyer"&&( <View>
        {isProductInWishlist(item.id) ? (
              <TouchableOpacity style={styles.heartIcon} onPress={() => deleteFavoriteItem(item.id)}>
                <Ionicons 
                              name="heart-dislike" 
                              size={25}
                              style={{top:1}}
                              color={"#f95151"} 
                          />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.heartIcon} onPress={() => addtoWishlist(item.id)}>
                <Ionicons 
                              name="heart-circle" 
                              size={33}
                              style={{top:1}}
                              color={"black"} 
                          />
              </TouchableOpacity>
            )}
      </View>)}
     
    </View>
 ) }

 
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.searchCont}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Fontisto name="filter" size={SIZES.xLarge} style={styles.searchIcon} />
      </TouchableOpacity>
  
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput} 
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder={t('search:placeholder')}
        />
      </View>
  
      <View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => searchwithBar(searchInput)}>
          <Feather name="search" size={24} color={COLORS.offwhite} />
        </TouchableOpacity>
      </View>
    </View>
    
    
    {ProductSearch.length > 0 && (
     
    
      <FlatList
        data={ProductSearch}
        keyExtractor={(item, index) => item.id}
        renderItem={Item}
        style={styles.resultsList}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: "125%",elevation:4,backgroundColor:"white" }} 
      />
      
    )}
    
    
    {filteredData.length > 0 && searchInput.length > 0 && (
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdown}>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSearchInput(item.name)}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
       
      </View>
    )}
  
    <ModalSearch modalVisible={modalVisible} setModalVisible={setModalVisible} />
  </SafeAreaView>
  
  );
};

export default Search;

