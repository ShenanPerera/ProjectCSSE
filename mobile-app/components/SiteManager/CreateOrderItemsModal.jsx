import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { GetAllItemsURI, GetAllSitesURI } from '../../constants/URI';
import CloseIcon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

const CreateOrderItemsModal = ({ visibility, setVisibility }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [sites, setSites] = useState([]);
  const [address, setAddress] = useState();
  const [supplier, setSupplier] = useState();
  const [qty, setQty] = useState(0);

  useState(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(GetAllItemsURI);
        const json = await response.json();
        if (response.ok) {
          setItems(json);
          setName(json[0]);
          console.log(json);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSites = async () => {
      try {
        const response = await fetch(GetAllSitesURI);
        const json = await response.json();
        if (response.ok) {
          setSites(json);
          setAddress(json[0]);
          console.log(json);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
    fetchSites();
  }, []);

  const handleSelectItem = (val) => {
    setName(val);
    setSupplier(val.supplier);
  };

  return (
    <View>
      <Modal
        isVisible={visibility}
        onBackdropPress={this.close}
        backdropColor="#fff"
        backdropOpacity={1}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        propagateSwipe
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={{
          backgroundColor: 'white',
          padding: 30,
        }}
        coverScreen={true}
      >
        <CloseIcon
          size={48}
          name="close"
          onPress={() => setVisibility(false)}
          style={{ position: 'absolute', top: 0, right: 0, color: '#facc15' }}
        />
        <ScrollView className=" flex-1">
          {items && sites && (
            <>
              <Text className="text-lg mt-6  mb-2 font-bold">Item Name</Text>
              <View className="border border-1 rounded-xl">
                <Picker
                  className=""
                  placeholder="Select Item"
                  selectedValue={name}
                  dropdownIconColor={'black'}
                  dropdownIconRippleColor={'#0284C7'}
                  selectionColor={'#0284C7'}
                  onValueChange={(itemValue) => handleSelectItem(itemValue)}
                  style={{ borderWidth: 4, borderColor: '#000' }}
                >
                  {items &&
                    items.map((item, index) => (
                      <Picker.Item key={index} label={item.name} value={item} />
                    ))}
                </Picker>
              </View>

              <Text className={'text-lg  mb-2 mt-6 font-bold'}>Supplier</Text>
              <TextInput
                value={supplier && supplier.name}
                readOnly={true}
                className={'border border-1 rounded-xl p-[12px] '}
              />

              <Text className={'text-lg mt-6 mb-2  font-bold'}>
                Select Site Address
              </Text>
              <View className="border border-1 rounded-xl">
                <Picker
                  className="border border-4 px-4 py-2"
                  placeholder="Select Site Address"
                  selectedValue={address}
                  dropdownIconColor={'black'}
                  dropdownIconRippleColor={'#0284C7'}
                  selectionColor={'#0284C7'}
                  onValueChange={(itemValue) => setAddress(itemValue)}
                >
                  {sites &&
                    sites.map((site) => (
                      <Picker.Item
                        key={site}
                        label={site.address}
                        value={site}
                      />
                    ))}
                </Picker>
              </View>

              <Text className={'text-lg mt-6  mb-2 font-bold'}>Quantity</Text>
              <TextInput
                placeholder="Enter Quantity"
                value={qty}
                onValueChange={(val) => setQty(val)}
                className={'border border-1 rounded-xl p-[12px] '}
                keyboardType="numeric"
                inputMode="numeric"
              />

              <Text className={'text-lg mt-8 mb-2  font-bold'}>
                Requested Date
              </Text>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

export default CreateOrderItemsModal;
