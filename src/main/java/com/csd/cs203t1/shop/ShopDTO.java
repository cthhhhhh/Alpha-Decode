package com.csd.cs203t1.shop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ShopDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ShopItemDTO {
        private Long id;
        private String name;
        private String assetId;
        private String type;
        private int price;
        private String status; // "equipped", "owned", "locked"
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EquipResponse {
        private Long equippedOutfitId;
        private Long equippedPetId;
    }
}
