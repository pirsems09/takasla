import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type SectionCardProps = {
  eyebrow: string;
  title?: string | null;
  description?: string | null;
  children: React.ReactNode;
};

/**
 * SectionCard — form bölümlerini gruplandıran kart container.
 *
 * eyebrow (üst etiket), title ve description başlık alanını oluşturur;
 * children ise kart gövdesinde render edilir.
 */
const SectionCard = ({
  eyebrow,
  title,
  description,
  children,
}: SectionCardProps) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionCardHeader}>
      <ThemedText style={styles.sectionEyebrow}>{eyebrow}</ThemedText>
      {title ? <ThemedText style={styles.sectionTitle}>{title}</ThemedText> : null}
      {description ? (
        <ThemedText style={styles.sectionDescription}>{description}</ThemedText>
      ) : null}
    </View>
    <View style={styles.sectionCardBody}>{children}</View>
  </View>
);

export default SectionCard;

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: 20,
    padding: 18,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e7e8',
    shadowColor: '#1b1d1f',
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sectionCardHeader: {
    marginBottom: 16,
    gap: 4,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#306576',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#191c1d',
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6c757a',
  },
  sectionCardBody: {
    gap: 2,
  },
});
