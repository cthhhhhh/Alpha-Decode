package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;

import java.util.List;

public interface ShopService {
    List<ShopDTO.ShopItemDTO> getShopItems(User user);
    ShopDTO.EquipResponse buyItem(User user, Long itemId);
    ShopDTO.EquipResponse equipItem(User user, Long itemId);
    ShopDTO.EquipResponse unequipSlot(User user, String slot);
}
