import React, { useEffect, useState, useContext } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import SearchBar from '../Components/SearchBar';
import {calculateDistance} from '../Utiles';
import {PlaceItem} from '../Components/PlaceItem';
import {AppContext} from '../Providers/AppProvider';

export const SearchScreen = () =>{
    const [state, dispatch] = useContext(AppContext);
    const [filteredPlaces, setFilteredPlaces] = useState(state.places);
    const [clicked, setClicked] = useState(false);
    const [searchPhrase, setSearchPhrase]=useState('');

    const handleResetSearchValue = () =>{
        setSearchPhrase('')
        setFilteredPlaces(state.places)
    }


    useEffect(()=>{
        if(searchPhrase.length > 2){
            const filteredPlaces = state.places.filter(
                (place) => 
                place.name.toLowerCase().includes(searchPhrase.toLowerCase()) || 
                place.description.toLowerCase().includes(searchPhrase.toLowerCase())
            )
            setFilteredPlaces(filteredPlaces)
        }
    }, [searchPhrase])

    return (
        <View style={styles.container}>
            <SearchBar 
                clicked={clicked}
                searchPhrase={searchPhrase} 
                setSearchPhrase={setSearchPhrase}
                setClicked={setClicked}
                resetSearchValue={handleResetSearchValue}
            />

             {
                filteredPlaces.length > 0 ?
                <>
                    
                    <FlatList
                        data={filteredPlaces}
                        renderItem={({item}) => <PlaceItem data={item}/> }
                        keyExtractor={(item, id) => id}
                        // ListHeaderComponent={()=>   }
                    />
                </>
                : 
                searchPhrase != "" && searchPhrase.length > 2 ? 
                    <Text style={styles.distanceText}>Votre recherche ne permet pas de vous proposer de lieux ...</Text> : 
                    null
                        
            }

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor : '#000',
     padding:5
    },
     title:{
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        padding:20
    },
    distanceText:{
         fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        // padding:10
    },
    sliderContainer:{
        marginTop: 20,
        marginBottom: 40,
    }
})
