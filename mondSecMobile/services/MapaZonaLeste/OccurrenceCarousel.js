import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";

/* --- Componente filho OccurrenceCarousel --- */
const OccurrenceCarousel = ({
  items = [],
  initialIndex = 0,
  onClose = () => {},
  carregarComentarios = async () => [], // função passada pelo pai para carregar comentários
  renderDetail = null, // função para renderizar o detalhe da ocorrência
}) => {
  const [index, setIndex] = useState(initialIndex);
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  const flatRef = useRef(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const windowWidth = Dimensions.get("window").width;
  const itemWidth = Math.round(windowWidth * 0.85);

  /** Rola para o item inicial quando o modal abre */
  useEffect(() => {
    setIndex(initialIndex || 0);
    setTimeout(() => {
      try {
        flatRef.current?.scrollToIndex({
          index: initialIndex || 0,
          animated: false,
        });
      } catch (e) {}
    }, 40);
  }, [initialIndex, items]);

  /** Detecta troca de card + carrega comentários */
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;

    const first = viewableItems[0].item;
    const idx = viewableItems[0].index ?? 0;

    setIndex(idx);

    (async () => {
      setLoadingComentarios(true);
      const idOc = first?.id ?? first?._id;

      if (idOc) {
        try {
          const coms = await carregarComentarios(idOc);
          setComentarios(coms || []);
        } catch (e) {
          setComentarios([]);
        }
      } else {
        setComentarios([]);
      }

      setLoadingComentarios(false);
    })();
  }).current;

  return (
    <>
      <FlatList
        ref={flatRef}
        data={items?.length ? items : []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => (item.id ?? item._id ?? i).toString()}
        renderItem={({ item }) => (
          <View style={{ width: itemWidth, paddingHorizontal: 0 }}>
            {typeof renderDetail === "function" ? (
              renderDetail(item, { comentarios, loadingComentarios })
            ) : (
              <ScrollView style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", marginBottom: 6 }}>
                  {item.tipo || "Ocorrência"}
                </Text>

                <Text style={{ marginBottom: 8 }}>
                  {item.descricao || item.texto || "—"}
                </Text>

                <Text style={{ marginBottom: 6, fontWeight: "600" }}>
                  Endereço
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  {item.endereco || item.street || "—"}
                </Text>

                <Text style={{ marginBottom: 6, fontWeight: "600" }}>
                  Data
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  {item.dataAcontecimento || item.created_at || ""}
                </Text>

                {/* Comentários */}
                <View style={{ marginTop: 8 }}>
                  {loadingComentarios ? (
                    <ActivityIndicator />
                  ) : comentarios?.length ? (
                    comentarios.map((c, i) => (
                      <View
                        key={c.id ?? i}
                        style={{
                          padding: 8,
                          backgroundColor: "#f2f2f2",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ fontWeight: "700" }}>
                          {c.usuario?.name ||
                            c.usuario?.nome ||
                            "Usuário"}
                        </Text>
                        <Text>{c.mensagem}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ fontStyle: "italic", color: "#666" }}>
                      Nenhum comentário
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={initialIndex || 0}
        getItemLayout={(data, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
      />

      {/* Indicadores */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 8,
        }}
      >
        {items?.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor:
                i === index ? "#FFF" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </View>
    </>
  );
};

export default OccurrenceCarousel;
